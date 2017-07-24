<?php
require('fpdf.php');
	//  Define variable
	global $info;
	$info=array();
	$info['buyers_signiture']='Rabeya sultana rabu1';
	$info['buyers_signiture_date']='22-07-2015';
	$info['sellers_signiture']='Rabeya sultana rabu1 reza';
	$info['sellers_signiture_date']='23-07-2015';
	
	
class PDF extends FPDF
{
var $B;
var $I;
var $U;
var $HREF;

function PDF($orientation='P', $unit='mm', $size='A4')
{
    // Call parent constructor
    $this->FPDF($orientation,$unit,$size);
    // Initialization
    $this->B = 0;
    $this->I = 0;
    $this->U = 0;
    $this->HREF = '';
}

function WriteHTML($html)
{
    // HTML parser
    $html = str_replace("\n",' ',$html);
    $a = preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE);
    foreach($a as $i=>$e)
    {
        if($i%2==0)
        {
            // Text
            if($this->HREF)
                $this->PutLink($this->HREF,$e);
            else
                $this->Write(5,$e);
        }
        else
        {
            // Tag
            if($e[0]=='/')
                $this->CloseTag(strtoupper(substr($e,1)));
            else
            {
                // Extract attributes
                $a2 = explode(' ',$e);
                $tag = strtoupper(array_shift($a2));
                $attr = array();
                foreach($a2 as $v)
                {
                    if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3))
                        $attr[strtoupper($a3[1])] = $a3[2];
                }
                $this->OpenTag($tag,$attr);
            }
        }
    }
}

function OpenTag($tag, $attr)
{
    // Opening tag
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,true);
    if($tag=='A')
        $this->HREF = $attr['HREF'];
    if($tag=='BR')
        $this->Ln(5);
}

function CloseTag($tag)
{
    // Closing tag
    if($tag=='B' || $tag=='I' || $tag=='U')
        $this->SetStyle($tag,false);
    if($tag=='A')
        $this->HREF = '';
}

function SetStyle($tag, $enable)
{
    // Modify style and select corresponding font
    $this->$tag += ($enable ? 1 : -1);
    $style = '';
    foreach(array('B', 'I', 'U') as $s)
    {
        if($this->$s>0)
            $style .= $s;
    }
    $this->SetFont('',$style);
}

function PutLink($URL, $txt)
{
    // Put a hyperlink
    $this->SetTextColor(0,0,255);
    $this->SetStyle('U',true);
    $this->Write(5,$txt,$URL);
    $this->SetStyle('U',false);
    $this->SetTextColor(0);
}


//Cell with horizontal scaling if text is too wide
	function CellFit($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='', $scale=false, $force=true)
	{
		//Get string width
		$str_width=$this->GetStringWidth($txt);

		//Calculate ratio to fit cell
		if($w==0)
			$w = $this->w-$this->rMargin-$this->x;
		$ratio = ($w-$this->cMargin*2)/$str_width;

		$fit = ($ratio < 1 || ($ratio > 1 && $force));
		if ($fit)
		{
			if ($scale)
			{
				//Calculate horizontal scaling
				$horiz_scale=$ratio*100.0;
				//Set horizontal scaling
				$this->_out(sprintf('BT %.2F Tz ET',$horiz_scale));
			}
			else
			{
				//Calculate character spacing in points
				$char_space=($w-$this->cMargin*2-$str_width)/max($this->MBGetStringLength($txt)-1,1)*$this->k;
				//Set character spacing
				$this->_out(sprintf('BT %.2F Tc ET',$char_space));
			}
			//Override user alignment (since text will fill up cell)
			$align='';
		}

		//Pass on to Cell method
		$this->Cell($w,$h,$txt,$border,$ln,$align,$fill,$link);

		//Reset character spacing/horizontal scaling
		if ($fit)
			$this->_out('BT '.($scale ? '100 Tz' : '0 Tc').' ET');
	}

	//Cell with horizontal scaling only if necessary
	function CellFitScale($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,false);
	}

	//Cell with horizontal scaling always
	function CellFitScaleForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,true,true);
	}

	//Cell with character spacing only if necessary
	function CellFitSpace($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,false);
	}

	//Cell with character spacing always
	function CellFitSpaceForce($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='')
	{
		//Same as calling CellFit directly
		$this->CellFit($w,$h,$txt,$border,$ln,$align,$fill,$link,false,true);
	}

	//Patch to also work with CJK double-byte text
	function MBGetStringLength($s)
	{
		if($this->CurrentFont['type']=='Type0')
		{
			$len = 0;
			$nbbytes = strlen($s);
			for ($i = 0; $i < $nbbytes; $i++)
			{
				if (ord($s[$i])<128)
					$len++;
				else
				{
					$len++;
					$i++;
				}
			}
			return $len;
		}
		else
			return strlen($s);
	}





//  Code for creating pdf

// Page header
function Header()
{
		$this->SetFont('Arial','B',10);
		$this->Cell(0,1,'Presidential Realty',0,1,'L');
		$this->SetFont('Arial','B',16);
		$this->Cell(100,12,'MARKET CONDITIONS ADVISORY',0,0,'L');
		$this->SetFont('Arial','',6);
		$this->SetX(175);
		$this->Cell(0,4,'Document updated:','L',0,'');
		$this->Ln();
		$this->SetX(175);
		$this->SetFont('Arial','B',6);
		$this->Cell(25,2,'August 2009','L',1,'C');
		$this->SetX(175);
		$this->Cell(0,4,'','L',1,'C');
		
		$this->Cell(40,20,$this->Image('images/arizona_left.png',$this->GetX()+2, $this->GetY()+2,35,15),'1',0,'C');
		$this->SetFont('Arial','I',8);
		
		$this->MultiCell(125,4,utf8_decode("The pre-printed portion of this form has been drafted by the Arizona Association of REALTORS®. \nAny change in the pre-printed language of this form must be made in a prominent manner. \nNo representations are made as to the legal validity, adequacy and/or effects of any provision, \nincluding tax consequences thereof. If you desire legal, tax or other professional advice, please \nconsult your attorney, tax advisor or professional consultant."),'1','L');
		$this->SetY(21);
		$this->SetX(175);
		$this->Cell(25,20,$this->Image('images/arizona_right.png',$this->GetX()+2, $this->GetY()+4,20,10),'1',0,'C');
    
}

// Page footer
function Footer()
{	
	global $info;
	$str1=utf8_decode('Market Conditions Advisory . Updated: August 2009');
	$str2=utf8_decode('Copyright © 2009 Arizona Association of REALTORS®. All rights reserved.');
	$str3=utf8_decode('Produced with zipForm® by zipLogix  18070 Fifteen Mile Road, Fraser, Michigan 48026   ');
	$this->Cell(25,5,'','',1,'');
	$this->SetFont('Arial','',7);
	$this->Cell(180,3,'','B',1,'');  	
	$this->Cell(180,5,$str1,'',1,'C'); 
	$this->Cell(180,3,$str2,'',1,'C');
	$this->Cell(180,5,'','',1,'');
	$this->Cell(180,2,'Presidential Realty, 4856 E Baseline Rd #106 Mesa, AZ 85206','',1,'L'); 	
	$this->Cell(40,5,'Phone: 480-235-1400','',0,'');
	$this->Cell(20,5,'','',0,'');
	$this->Cell(30,5,"Fax: 480-212-5464",'',0,'');
	$this->Cell(20,5,'','',0,'');  
	$this->Cell(30,5,"Steve Peterson",'',1,'');
	
	$this->Image('images/footer_qr_code.png',$this->GetX()+170,$this->GetY()-15,15,0);
	$this->Ln();
	
	$this->SetY($this->GetY()-5);
	$this->SetX(60);
	$this->SetFont('Arial','',6);
	$this->Cell(70,3,$str3,0,0,'C');
	$this->SetX($this->GetX()+10);
	$this->SetFont('Arial','U',6);
	$this->Cell(15,5,' www.zipLogix.com',0,0,'','','https://zipLogix.com');
}

}

	$pdf = new PDF('P','mm',array(215,335));
	$pdf->AliasNbPages();
	$pdf->AddPage();
	$pdf->Ln();	
	
	$pdf->Cell(50,6,'','',1,'');	
	
	$pdf->SetFont('Arial','BI',19);
	$pdf->Cell(20,7,'','',0,'');
	$pdf->MultiCell(140,7,utf8_decode("The real estate market is cyclical \nand real estate values go up and down.
	"),'0',''); 
	
	
	$pdf->SetFont('Arial','BI',12);
	$pdf->Cell(20,5,'','',0,'');
	$pdf->Cell(140,5,'The financial market also changes, affecting the terms on which a lender','',0,'L');
	$pdf->Ln();
	$pdf->Cell(20,5,'','',0,'');
	$pdf->Cell(88,5,'will agree to loan money on real property .','',0,'L');
	$pdf->SetFont('Arial','BUI',12);
	$pdf->Cell(50,5,'It is impossible to accurately','',0,'');
	$pdf->Ln();
	$pdf->SetFont('Arial','BUI',12);
	$pdf->Cell(20,5,'','',0,'');
	$pdf->Cell(120,5,'predict what the real estate or financial market conditions will be at any ','',0,'L');
	$pdf->Ln();
	$pdf->Cell(20,5,'','',0,'');
	$pdf->Cell(20,5,'given time.','',0,'L');
	$pdf->Cell(10,10,'',0,1,'');
	
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(20,4,'','',0,'');
	$pdf->CellFitSpaceForce(150,4,'The ultimate decision on the price a Buyer is willing to pay and the price a Seller is willing to','',2,'');
	$pdf->CellFitSpaceForce(150,4,'accept for a specific property rests solely with the individual Buyer and Seller. The parties to','',2,'');
	$pdf->CellFitSpaceForce(150,4,'a real estate transaction must decide on what price and terms they are willing to buy or sell in','',2,'');
	$pdf->Cell(150,4,'light of market conditions, their own financial resources and their own unique circumstances.','',1,'');
	
	$pdf->Cell(10,8,'',0,1,'');
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(20,4,'','',0,'');
	$pdf->CellFitSpaceForce(150,4,'The parties must, upon careful deliberation, decide how much risk they are willing to assume in','',2,'');
	$pdf->CellFitSpaceForce(150,4,'a transaction. Any waiver of contingencies, rights or warranties in the Contract may have','',2,'');
	$pdf->Cell(150,4,'adverse consequences. Buyer and Seller acknowledge that they understand these risks.','',1,'');
	
	$pdf->Cell(10,8,'',0,1,'');
	
	$pdf->SetFont('Arial','',10);
	$pdf->Cell(20,4,'','',0,'');
	$pdf->CellFitSpaceForce(150,4,'Buyer and Seller assume all responsibility should the return on investment, tax consequences, ','',2,'');
	$pdf->CellFitSpaceForce(150,4,'credit effects, or financing terms not meet their expectations. The parties understand and','',2,'');
	$pdf->CellFitSpaceForce(150,4,'agree that the Broker(s) do not provide advice on property as an investment. Broker(s) are not','',2,'');
	$pdf->CellFitSpaceForce(150,4,'qualified to provide financial, legal, or tax advice regarding a real estate transaction. Therefore,','',2,'');
	$pdf->CellFitSpaceForce(150,4,'Broker(s) make no representation regarding the above items. Buyer and Seller are advised to','',2,'');
	$pdf->CellFitSpaceForce(150,4,'obtain professional tax and legal advice regarding the advisability of entering into this','',2,'');
	$pdf->Cell(150,4,'transaction','',1,'');

	$pdf->Cell(10,8,'',0,1,'');
	
	$pdf->SetFont('Arial','B',9);
	$pdf->Cell(20,4,'','',0,'');
	$pdf->CellFitSpaceForce(150,4,'THE UNDERSIGNED ACCEPT AND UNDERSTAND THE FOREGOING AND ACKNOWLEDGE','',2,'');
	$pdf->Cell(150,4,'RECEIPT OF A COPY OF THIS ADVISORY.','',2,'');
	$pdf->Cell(10,18,'',0,1,'');
		
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(7,5,'','',0,'');
	$pdf->Cell(40,7,$info['buyers_signiture'],'',0,'L');
	$pdf->Cell(40,7,$info['buyers_signiture_date'],'',0,'R');
	$pdf->Cell(14,7,'','',0,'');
	$pdf->Cell(40,7,$info['buyers_signiture'],'',0,'L');
	$pdf->Cell(40,7,$info['buyers_signiture_date'],'',1,'R');
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(80,1,'','T',0,'');
	$pdf->Cell(14,1,'','',0,'');
	$pdf->Cell(80,1,'','T',1,'');
	$pdf->Cell(7,2,'','',0,'');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(40,2,"^  BUYER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
	$pdf->Cell(14,2,'','',0,'');
	$pdf->Cell(40,2,"^  BUYER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');
	$pdf->Cell(10,8,'',0,1,'');
	
	$pdf->SetFont('Arial','',8);
	$pdf->Cell(7,5,'','',0,'');
	$pdf->Cell(40,7,$info['sellers_signiture'],'',0,'L');
	$pdf->Cell(40,7,$info['sellers_signiture_date'],'',0,'R');
	$pdf->Cell(14,7,'','',0,'');
	$pdf->Cell(40,7,$info['sellers_signiture'],'',0,'L');
	$pdf->Cell(40,7,$info['sellers_signiture_date'],'',1,'R');
	$pdf->Cell(7,1,'','',0,'');
	$pdf->Cell(80,1,'','T',0,'');
	$pdf->Cell(14,1,'','',0,'');
	$pdf->Cell(80,1,'','T',1,'');
	$pdf->Cell(7,2,'','',0,'');
	$pdf->SetFont('Arial','',6);
	$pdf->Cell(40,2,"^  SELLER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',0,'R');
	$pdf->Cell(14,2,'','',0,'');
	$pdf->Cell(40,2,"^  SELLER'S SIGNATURE",'',0,'L');
	$pdf->Cell(40,2,"MO/DA/YR",'',1,'R');
	$pdf->Cell(10,15,'',0,1,'');
	
	
	$pdf->Output('','I');
?>